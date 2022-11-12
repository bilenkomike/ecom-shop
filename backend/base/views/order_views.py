from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from base.models import Product, Order, OrderItem,ShippingAddress
from base.serializers import ProductSerializer,OrderSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from rest_framework import status



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data = request.data

    orederItems = data['orderItems']

    if orederItems and len(orederItems) == 0:

        return Response({'detail': 'No order items'}, status=status.HTTP_400_BAD_REQUEST)

    else:
        # Create Order

        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice'],
            )

        # Shipping Address
        shipping = ShippingAddress.objects.create(
            order=order, 
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country'],
        )
        # Create order Items
        for i in orederItems:
            product = Product.objects.get(_id=i['product'])
            item = OrderItem.objects.create(product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image.url
            )

            # update stock

            product.countInStock -= item.qty
            product.save()
            
        serializer = OrderSerializer(order, many=False)

        return Response(serializer.data)